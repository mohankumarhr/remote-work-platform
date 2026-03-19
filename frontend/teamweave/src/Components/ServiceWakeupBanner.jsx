import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../Styles/ServiceWakeupBanner.css';

const FIVE_MINUTES_IN_SECONDS = 5 * 60;
const REQUEST_INTERVAL_MS = 45 * 1000;

const defaultWakeUrls = [
  'https://team-service-ec7y.onrender.com',
  'https://task-service-ewiw.onrender.com',
  'https://chat-service-mnpe.onrender.com',
  'https://call-service-dpcq.onrender.com'
];

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const ServiceWakeupBanner = ({
  wakeUrls = defaultWakeUrls,
  projectInfoLink = 'https://teamweave-spotlight.netlify.app/',
}) => {
  const [secondsLeft, setSecondsLeft] = useState(FIVE_MINUTES_IN_SECONDS);
  const [respondedUrls, setRespondedUrls] = useState({});
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const respondedUrlsRef = useRef({});

  const normalizedUrls = useMemo(
    () => wakeUrls.filter((url) => typeof url === 'string' && url.trim().length > 0),
    [wakeUrls]
  );

  useEffect(() => {
    respondedUrlsRef.current = respondedUrls;
  }, [respondedUrls]);

  useEffect(() => {
    setSecondsLeft(FIVE_MINUTES_IN_SECONDS);
    setRespondedUrls({});
    respondedUrlsRef.current = {};
    setIsOverlayVisible(true);
  }, [normalizedUrls]);

  useEffect(() => {
    if (!isOverlayVisible || normalizedUrls.length === 0) {
      return undefined;
    }

    const wakeServices = async () => {
      const pendingUrls = normalizedUrls.filter((url) => !respondedUrlsRef.current[url]);

      if (pendingUrls.length === 0) {
        return;
      }

      const settledResponses = await Promise.allSettled(
        pendingUrls.map((url) =>
          fetch(url, {
            method: 'GET',
            cache: 'no-store',
            mode: 'no-cors',
          })
        )
      );

      setRespondedUrls((prev) => {
        const next = { ...prev };

        settledResponses.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            next[pendingUrls[index]] = true;
          }
        });

        return next;
      });
    };

    wakeServices();

    const wakeInterval = setInterval(() => {
      wakeServices();
    }, REQUEST_INTERVAL_MS);

    const stopWakeupTimeout = setTimeout(() => {
      clearInterval(wakeInterval);
    }, FIVE_MINUTES_IN_SECONDS * 1000);

    return () => {
      clearInterval(wakeInterval);
      clearTimeout(stopWakeupTimeout);
    };
  }, [isOverlayVisible, normalizedUrls]);

  useEffect(() => {
    if (!isOverlayVisible) {
      return undefined;
    }

    const countdown = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [isOverlayVisible]);

  useEffect(() => {
    if (secondsLeft === 0) {
      setIsOverlayVisible(false);
    }
  }, [secondsLeft]);

  useEffect(() => {
    if (
      normalizedUrls.length > 0 &&
      Object.keys(respondedUrls).length >= normalizedUrls.length
    ) {
      setIsOverlayVisible(false);
    }
  }, [normalizedUrls, respondedUrls]);

  if (!isOverlayVisible || normalizedUrls.length === 0) {
    return null;
  }

  return (
    <section className="serviceWakeupOverlay" role="status" aria-live="polite">
  <div className="serviceWakeupCard">

    <div className="serviceWakeupHeader">
      

      <div>
        <h3>Waking Backend Services</h3>
        <p>
          Some APIs are hosted on Render free instances. They may take a few
          seconds to wake up after inactivity.
        </p>
      </div>
    </div>

    <div className="serviceWakeupInfo">
      <div className="wakeTimer">
        Ready in ~ {formatTime(secondsLeft)}
      </div>

      <div className="wakeProgressText">
        {Object.keys(respondedUrls).length} / {normalizedUrls.length} services ready
      </div>

      <div className="progressBar">
        <div
          className="progressFill"
          style={{
            width: `${
              (Object.keys(respondedUrls).length / normalizedUrls.length) * 100
            }%`,
          }}
        />
      </div>

      <a
        href={projectInfoLink}
        target="_blank"
        rel="noreferrer noopener"
        className="projectInfoLink"
      >
        Meanwhile, learn more about the project →
      </a>
    </div>

  </div>
</section>
  );
};

export default ServiceWakeupBanner;
