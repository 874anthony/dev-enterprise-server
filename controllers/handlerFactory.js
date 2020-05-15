const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(
        new AppError('No document was found for that ID, try with another', 404)
      );
    }

    res.status(204).json({
      status: 'success',
      data: {
        message: 'The document was deleted successfully!'
      }
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    if (req.file) {
      req.body.imageCover = req.file.filename;
    } else if (req.files) {
      req.body.imageCover = req.files.imageCover[0].filename;
      req.body.images = [];

      req.files.images.forEach(file => req.body.images.push(file.filename));
    }

    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true
    });

    if (!document) {
      return next(
        new AppError('No document was found for that ID, try with another', 404)
      );
    }

    res.status(202).json({
      status: 'success',
      data: {
        document
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const body = { ...req.body };
    body.user = req.user._id;

    const newDocument = await Model.create(body);

    if (!newDocument) {
      return next(new AppError('We have an error, please try again', 500));
    }

    res.status(201).json({
      status: 'success',
      data: {
        document: newDocument
      }
    });
  });

exports.getOne = Model =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);

    if (!document) {
      return next(
        new AppError('No document was found for that ID, try with another', 404)
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        document
      }
    });
  });

exports.getAll = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.userId) filter = { user: req.params.userId };

    const query = Model.find(filter).populate(populateOptions);
    const documents = await query;

    res.status(200).json({
      status: 'success',
      total: documents.length,
      data: {
        documents
      }
    });
  });
