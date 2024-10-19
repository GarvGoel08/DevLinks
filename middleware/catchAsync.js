import { NextResponse } from 'next/server';

const catchAsync = (fn) => async (req, context) => {
    try {
        return await fn(req, context);
    } catch (err) {
        return NextResponse.json({
            status: err.status || 'error',
            message: err.message,
        }, { status: err.statusCode || 500 });
    }
};

export default catchAsync;
