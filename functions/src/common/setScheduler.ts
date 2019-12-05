import CONFIG from '../util/CONFIG';
import { google } from 'googleapis';
import { SetSchedulerParam } from '../../../types';
const cloudScheduler = google.cloudscheduler('v1beta1');

/**
 * Cloud Schedulerにジョブを設定する(update)
 * @param param
 * @returns result
 */
const setScheduler = (param: SetSchedulerParam): Promise<any> => {
  const { client, hour, minute } = param;
  const schedule = `${minute} ${hour} * * *`;
  const params = {
    name: `projects/${CONFIG.PROJECT_ID}/locations/${CONFIG.LOCATION_ID}/jobs/${CONFIG.JOB_NAME}`,
    updateMask: 'schedule',
    resource: {
      schedule,
      pubsubTarget: {
        topicName: `projects/${CONFIG.PROJECT_ID}/topics/${CONFIG.JOB_NAME}`,
      },
    },
    auth: client,
  };
  const castedParam = <any>params;
  return new Promise((resolve, reject) => {
    cloudScheduler.projects.locations.jobs.patch(
      castedParam,
      (error: any, response: any) => {
        error ? reject(error) : resolve(response.data);
      },
    );
  });
};

export default setScheduler;
