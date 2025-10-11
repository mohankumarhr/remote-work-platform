import React from 'react'
import '../Styles/StatCard.css'

function StatCard({ label, number, subtext, description, icon: Icon, iconColor }) {
    return (
        <div className='statCard'>
            <div className='statHeader'>
                <p className='statLabel'>{label}</p>
                <Icon style={{ color: iconColor, fontSize: '20px' }} />
            </div>
            <div className='statContent'>
                <h3 className='statNumber'>{number}</h3>
                <span className='statSubtext'>{subtext}</span>
                <span className='statDesc'>{description}</span>
            </div>
        </div>
    )
}

export default StatCard