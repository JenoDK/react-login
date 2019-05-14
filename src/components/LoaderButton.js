import React from "react";
import { Button, Spinner } from "react-bootstrap";
import "./LoaderButton.scss";

export default ({
    isLoading,
    text,
    loadingText,
    className = "",
    disabled = false,
    ...props
}) =>
    <Button
        className={`LoaderButton ${className}`}
        disabled={disabled || isLoading}
        {...props}
    >
        {isLoading && 
        <Spinner 
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="spinner"
        />}
        {!isLoading ? text : loadingText}
    </Button>;
