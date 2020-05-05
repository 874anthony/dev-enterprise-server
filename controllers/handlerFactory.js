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
    // TODO: Verify if it doesn't exist the req.body
    const newDocument = await Model.create(req.body);

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

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    const documents = await Model.find({});

    res.status(200).json({
      status: 'success',
      total: documents.length,
      data: {
        documents
      }
    });
  });
