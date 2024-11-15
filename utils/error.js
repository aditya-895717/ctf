export const errorHandler = (statusCode, message) => {
    const error = new Error(message); // Pass the message to Error constructor
    error.statusCode = statusCode;
    return error;
};

//errorHandler middleware