import { model, Schema } from 'mongoose';

const docSchema = new Schema(
    {
        description: Schema.Types.String,
        document: {
            type: Schema.Types.Map,
            default: {}
        },
        revisionNumber: {
            type: Schema.Types.Number,
            default: 0
        }
    }, {
        timestamps: true
    }
);

const docModel = model('Doc', docSchema);

export default docModel;
