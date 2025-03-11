import React, { useState, useEffect } from 'react';

function Campaign({dateandtime}) {
    console.log(dateandtime)
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const calculateTimeLeft = () => {
        const targetDate = new Date(dateandtime); // Replace with your target date
        const now = new Date();
        const difference = targetDate - now;

        let time = {};

        if (difference > 0) {
            time = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return time;
    };


    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer); // Cleanup the timer
    }, []);

    return (
        <>
            <div className='campaign-countdown mt-3'>
                <div className='box-group d-flex'>
                    <div className='box'>
                        <strong>{timeLeft.days}</strong>
                        <span>Days</span>
                    </div>
                    <div className='box'>
                        <strong>{timeLeft.hours}</strong>
                        <span>Hours</span>
                    </div>
                    <div className='box'>
                        <strong>{timeLeft.minutes}</strong>
                        <span>Minutes</span>
                    </div>
                    <div className='box'>
                        <strong>{timeLeft.seconds}</strong>
                        <span>Seconds</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Campaign