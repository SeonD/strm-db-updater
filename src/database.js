import Doc from './models/doc';

const getDocById = async (docId) => {
    const doc = await Doc.findById(docId).exec();
    return doc;
};

const updateDoc = async (doc) => {
    doc.revisionNumber++;
    await Doc.findByIdAndUpdate(doc._id, doc).exec();
};

export { getDocById, updateDoc };