const BatchModel = require('../models/batch');

let batchRoutes = {};

batchRoutes.batchesGetRoute = (_req, res) => {
    BatchModel.find({}, 'name', { sort: { name: 1 } }, (err, batches) => {
        if (err) {
            console.log(err);
        }
        res.render('batch/batches', {
            batches
        });
    });
};

batchRoutes.modifyBatchPostRoute = (req, res) => {
    const { id, name } = req.body;
    if (!name) {
        req.flash('error_msgs', 'Please fill in all required fields');
        res.redirect('/batches');
        return;
    }
    if (!id) { // create new batch
        let newBatch = new BatchModel({ name });
        newBatch.save()
            .then(_batch => {
                req.flash('success_msgs', 'Added New Batch!');
                res.redirect('/batches');
            })
            .catch(err => console.log(err));
    } else {
        let update = { $set: { name } };
        BatchModel.findOneAndUpdate({ _id: id }, update, { new: true, upsert: false }, (err, _batch) => {
            if (err) console.log(err);
            else {
                req.flash('success_msgs', 'Batch updated!');
                res.redirect('/batches');
            }
        });
    }
};

batchRoutes.deleteBatchGetRoute = (req, res) => {
    if (!req.params.id) {
        req.flash('error_msgs', 'Please fill in all required fields');
        res.redirect('/batches');
        return;
    }
    BatchModel.deleteOne({ _id: req.params.id }, (err, _student) => {
        if (err) {
            console.log(err);
        } else {
            req.flash('success_msgs', 'Batch deleted!');
        }
        res.redirect('/batches');
    });
};

module.exports = batchRoutes;
