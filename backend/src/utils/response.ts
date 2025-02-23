import { Response } from "express";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export const sendSuccess = <T>(res: Response, message: string, data: T) => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data
    };
    res.status(200).json(response);
};

export const sendCreated = <T>(res: Response, message: string, data: T) => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data
    };
    res.status(201).json(response);
};

export const sendBadRequest = (res: Response, message: string, error: string) => {
    const response: ApiResponse<null> = {
        success: false,
        message,
        error
    };
    res.status(400).json(response);
};

export const sendUnauthorized = (res: Response, message: string, error: string) => {
    const response: ApiResponse<null> = {
        success: false,
        message,
        error
    };
    res.status(401).json(response);
};

export const sendNotFound = (res: Response, message: string, error: string) => {
    const response: ApiResponse<null> = {
        success: false,
        message,
        error
    };
    res.status(404).json(response);
};

export const sendServerError = (res: Response, message: string, error: string) => {
    const response: ApiResponse<null> = {
        success: false,
        message,
        error
    };
    res.status(500).json(response);
};
