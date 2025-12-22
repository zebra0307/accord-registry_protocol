use anchor_lang::prelude::*;
use crate::models::*;
use crate::instructions::contexts::*;

pub fn initialize_platform_stats(ctx: Context<InitializePlatformStats>) -> Result<()> {
    let stats = &mut ctx.accounts.stats;
    stats.total_registered_users = 0;
    stats.total_validators = 0;
    stats.total_transactions = 0;
    stats.total_volume_credits = 0;
    stats.bump = ctx.bumps.stats;
    msg!("Platform Statistics Ledger Initialized");
    Ok(())
}

pub fn submit_monitoring_data(
    ctx: Context<SubmitMonitoringData>,
    _project_id: String,
    _timestamp: i64,
    monitoring_data: MonitoringDataInput,
) -> Result<()> {
    let monitoring = &mut ctx.accounts.monitoring_data;
    let _project = &mut ctx.accounts.project;

    monitoring.project_id = monitoring_data.project_id.clone();
    monitoring.timestamp = Clock::get()?.unix_timestamp;
    monitoring.satellite_imagery_cid = monitoring_data.satellite_imagery_cid;
    monitoring.ndvi_index = monitoring_data.ndvi_index;
    monitoring.water_quality = monitoring_data.water_quality;
    monitoring.temperature_data = monitoring_data.temperature_data;
    monitoring.tide_data = monitoring_data.tide_data;
    monitoring.iot_sensor_data = monitoring_data.iot_sensor_data;
    monitoring.ecosystem_health_score = monitoring_data.ecosystem_health_score;

    // Dynamic Monitoring Trigger
    // If health score drops below 50, flag project for review
    if monitoring.ecosystem_health_score < 50.0 {
        let project = &mut ctx.accounts.project;
        project.verification_status = VerificationStatus::Monitoring;
        msg!("WARNING: Project health critical! Status updated to Monitoring.");
    }

    msg!("Monitoring data submitted for project: {}", monitoring.project_id);
    msg!("Ecosystem health score: {}", monitoring.ecosystem_health_score);

    Ok(())
}