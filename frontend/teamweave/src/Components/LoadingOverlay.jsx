import React from 'react'
import '../Styles/LoadingOverlay.css'

function LoadingOverlay({ message = 'Loading...' }) {
    return (
        <div className='loadingOverlay' role='status' aria-live='polite' aria-label={message}>
            <div className='loadingOverlayContent'>
                <div className='loadingSpinner'></div>
                <span className='loadingMessage'>{message}</span>
            </div>
        </div>
    )
}

export default LoadingOverlay
