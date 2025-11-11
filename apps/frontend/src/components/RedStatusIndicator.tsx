import { useState, useEffect, useCallback } from 'react';
import { RedStatusResponse } from '@food-store-calculator/shared';
import { api } from '../services/api';
import './RedStatusIndicator.css';

export default function RedStatusIndicator() {
  const [status, setStatus] = useState<RedStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [nextAvailableTime, setNextAvailableTime] = useState<Date | null>(null);

  const loadStatus = useCallback(async () => {
    try {
      const data = await api.getRedStatus();
      setStatus(data);
      
      if (data.remainingTimeMs !== undefined && data.remainingTimeMs > 0) {
        setRemainingTime(data.remainingTimeMs);
        // Calculate next available time
        const nextTime = new Date(Date.now() + data.remainingTimeMs);
        setNextAvailableTime(nextTime);
      } else {
        setRemainingTime(null);
        setNextAvailableTime(null);
      }
    } catch (err) {
      console.error('Failed to load red status', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
    const statusInterval = setInterval(loadStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(statusInterval);
  }, [loadStatus]);

  useEffect(() => {
    if (status && !status.canOrder && status.remainingTimeMs !== undefined && status.remainingTimeMs > 0) {
      setRemainingTime(status.remainingTimeMs);
      
      const countdownInterval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev === null || prev <= 1000) {
            loadStatus(); // Reload status when countdown reaches 0
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    } else {
      setRemainingTime(null);
      setNextAvailableTime(null);
    }
  }, [status, loadStatus]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (date: Date): string => {
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="red-status loading">
        <span className="red-status-text">กำลังโหลดสถานะ Red Set...</span>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <div className={`red-status ${status.canOrder ? 'available' : 'unavailable'}`}>
      <span className="red-status-icon">
        {status.canOrder ? '✅' : '⏰'}
      </span>
      <div className="red-status-content">
        <div className="red-status-header">
          <span className="red-status-title">
            {status.canOrder ? 'Red Set พร้อมสั่งได้' : 'Red Set ถูกสั่งไปแล้ว'}
          </span>
        </div>
        
        {!status.canOrder && remainingTime !== null && remainingTime > 0 && (
          <div className="red-status-details">
            <div className="red-status-countdown">
              <span className="countdown-label">เหลือเวลา:</span>
              <span className="countdown-time">{formatTime(remainingTime)}</span>
            </div>
            {nextAvailableTime && (
              <div className="red-status-next-time">
                <span className="next-time-label">สามารถสั่งได้อีกครั้ง:</span>
                <span className="next-time-value">{formatDateTime(nextAvailableTime)}</span>
              </div>
            )}
          </div>
        )}
        
        {!status.canOrder && remainingTime !== null && remainingTime <= 0 && (
          <div className="red-status-details">
            <span className="red-status-message">กำลังตรวจสอบสถานะ...</span>
          </div>
        )}
      </div>
    </div>
  );
}

