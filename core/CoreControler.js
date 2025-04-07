import HttpStatusCodes from "../enums/HttpStatusCodes.js";
import Coreclass from "./CoreClass.js";

export default class CoreController extends Coreclass {
    constructor() {
        super();
    }

    response = async (res, { content, headers, info, status, error } = { status: HttpStatusCodes.SUCCESS, content: {} }) => {
        if (!res) throw new Error('res parameter needed');

        const baseResponse = {
            statusCode: status.code,
            headers,
            info: info || status.message,
            isSuccess: status.code < HttpStatusCodes.BAD_REQUEST.code
        }

        if (error) this.logger.error(error);
            
        return res.status(status.code).type('json').send(
            JSON.stringify(!error ?
                {
                    ...baseResponse,
                    content: content && typeof content === 'object' ? content : (content ?? {})
                } :
                {
                    ...baseResponse,
                    error: {
                        message: error.message,
                        stack: error.stack
                    },
                    content: (content ?? {})
                }
                , null, 4) + '\n');
    }
}