import { Consumer, KafkaClient, Admin } from 'kafka-node';

import { KAFKA } from './config';
import { getDocById, updateDoc } from './database';
import actionHandlers from 'strm-action-handler';
import { logger } from './utils/logger';

logger.info(`DB UPDATER: Connecting to Kafka at ${KAFKA.BROKER_URL}`);
const kafkaClient = new KafkaClient({kafkaHost: KAFKA.BROKER_URL});

const getAdmin = () => {
    const admin = new Admin(kafkaClient);

    return admin;
};

const getConsumer = (topic) => {
    const consumer = new Consumer(kafkaClient, [
        { topic, partition: 0 }
    ], { autoCommit: false });

    return consumer;
};

const handleMessage = async (message) => {
    const { actionType, params, revisionNumber, docId } = parseAction(message.value);
        
    const doc = await getDocById(docId);

    if (doc.revisionNumber != revisionNumber - 1) {
        logger.info(`Revision Number Mismatch: Current (${doc.revisionNumber}), Action (${revisionNumber})`);
        return;
    }
    
    const handler = actionHandlers[actionType];
    if (!handler) {
        logger.error(`Invalid action type: ${actionType}`);
        return;
    }
    if (!handler.validate(params)) {
        logger.error(`Invalid parameters for action ${actionType}`);
        return;
    }
    doc.document = actionHandlers[actionType].apply(doc.document, params);

    await updateDoc(doc);
    logger.info(`Doc ${docId} updated.`);
};

export { getAdmin, getConsumer, handleMessage };

function parseAction(rawMessage) {
    const obj = JSON.parse(rawMessage);
    return {
        actionType: obj.action_type,
        params: obj.params,
        revisionNumber: obj.revision_number,
        docId: obj.doc_id
    };
}
