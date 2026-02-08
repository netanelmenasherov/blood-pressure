
export enum AlertLevel {
    NORMAL = 'NORMAL',
    ELEVATED = 'ELEVATED',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

export const ALERT_COLORS = {
    [AlertLevel.NORMAL]: 'green',
    [AlertLevel.ELEVATED]: 'yellow',
    [AlertLevel.HIGH]: 'orange',
    [AlertLevel.CRITICAL]: 'red',
} as const;

export type AlertResult = {
    sysAlert: AlertLevel;
    diaAlert: AlertLevel;
    hrAlert: AlertLevel;
    overallAlert: AlertLevel;
};

/**
 * Calculates the alert level for Systolic Blood Pressure.
 * < 120: Normal
 * 120-129: Elevated
 * 130-139: High
 * >= 140: Critical
 */
export function getSystolicAlert(sys: number): AlertLevel {
    if (sys < 120) return AlertLevel.NORMAL;
    if (sys < 130) return AlertLevel.ELEVATED; // 120-129
    if (sys < 140) return AlertLevel.HIGH;     // 130-139
    return AlertLevel.CRITICAL;                // >= 140
}

/**
 * Calculates the alert level for Diastolic Blood Pressure.
 * < 80: Normal
 * 80-89: Elevated
 * 90-99: High
 * >= 100: Critical
 */
export function getDiastolicAlert(dia: number): AlertLevel {
    if (dia < 80) return AlertLevel.NORMAL;
    if (dia < 90) return AlertLevel.ELEVATED; // 80-89
    if (dia < 100) return AlertLevel.HIGH;    // 90-99
    return AlertLevel.CRITICAL;               // >= 100
}

/**
 * Calculates the alert level for Heart Rate.
 * 60-100: Normal
 * 50-59 or 101-110: Elevated
 * 40-49 or 111-130: High
 * < 40 or > 130: Critical
 */
export function getHeartRateAlert(hr: number): AlertLevel {
    if (hr >= 60 && hr <= 100) return AlertLevel.NORMAL;

    // Elevated ranges
    if ((hr >= 50 && hr < 60) || (hr > 100 && hr <= 110)) {
        return AlertLevel.ELEVATED;
    }

    // High ranges
    if ((hr >= 40 && hr < 50) || (hr > 110 && hr <= 130)) {
        return AlertLevel.HIGH;
    }

    // Critical (catch-all for < 40 or > 130)
    return AlertLevel.CRITICAL;
}

/**
 * Determines the overall alert level based on individual components.
 * Logic: max(sys, dia, hr) where Critical > High > Elevated > Normal
 */
export function getOverallAlert(
    sysAlert: AlertLevel,
    diaAlert: AlertLevel,
    hrAlert: AlertLevel
): AlertLevel {
    const urgency = {
        [AlertLevel.CRITICAL]: 3,
        [AlertLevel.HIGH]: 2,
        [AlertLevel.ELEVATED]: 1,
        [AlertLevel.NORMAL]: 0,
    };

    const maxScore = Math.max(
        urgency[sysAlert],
        urgency[diaAlert],
        urgency[hrAlert]
    );

    if (maxScore === 3) return AlertLevel.CRITICAL;
    if (maxScore === 2) return AlertLevel.HIGH;
    if (maxScore === 1) return AlertLevel.ELEVATED;
    return AlertLevel.NORMAL;
}

/**
 * Convenience function to calculate all alerts at once.
 */
export function calculateAlerts(
    systolic: number,
    diastolic: number,
    heartRate: number
): AlertResult {
    const sysAlert = getSystolicAlert(systolic);
    const diaAlert = getDiastolicAlert(diastolic);
    const hrAlert = getHeartRateAlert(heartRate);

    const overallAlert = getOverallAlert(sysAlert, diaAlert, hrAlert);

    return {
        sysAlert,
        diaAlert,
        hrAlert,
        overallAlert,
    };
}
