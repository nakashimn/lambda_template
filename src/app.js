const axios = require('axios');

exports.handler = async (event) => {
    // const
    const appName = process.env.APP_NAME ?? 'CodebuildNotification';
    const account = event.account;
    const region = event.region;
    const buildDetails = event.detail;
    const buildStatus = buildDetails['build-status'];
    const buildId = buildDetails['build-id'];
    const streamName = buildDetails['additional-information']['logs']['stream-name'];
    const buildNumber = buildDetails['additional-information']['build-number'];
    const currentPhaseContext = buildDetails['current-phase-context'];
    const webhookUrl = process.env.WEBHOOK_URL;
    const messages = {
        'IN_PROGRESS': process.env.IN_PROGRESS_MESSAGE ?? 'The build has started.',
        'SUCCEEDED': process.env.SUCCEEDED_MESSAGE ?? 'The build completed successfully.',
        'FAILED': process.env.FALIED_MESSAGE ?? 'The build failed.'
    };

    // construct project name
    var projectName = buildDetails['project-name'];
    if (buildNumber != null) {
        projectName += `:${buildNumber}`;
    }

    // construct Codebuild URL
    var codebuildPageUrl = `https://${region}.console.aws.amazon.com/codesuite/codebuild/${account}/projects/${projectName}`;
    if (streamName != null) {
        codebuildPageUrl += `/build/${projectName}%3A${streamName}/log`;
    }

    // logging
    console.log(`[${appName}] DEBUG | project-name: ${projectName}`);
    console.log(`[${appName}] DEBUG | build-id: ${buildId}}`);
    console.log(`[${appName}] DEBUG | build-status: ${buildStatus}`);
    console.log(`[${appName}] DEBUG | codebuild-url: ${codebuildPageUrl}`);
    console.log(`[${appName}] DEBUG | current-phase-context: ${currentPhaseContext}`);
    console.log(`[${appName}] DEBUG | webhook-url: ${webhookUrl}`);

    // notification
    const message = {
        text: `[${projectName}]\n${messages[buildStatus]}\n${codebuildPageUrl}`
    };
    const headers = {'Content-Type': 'application/json'};
    await axios.post(webhookUrl, message, headers)
    .then(response => {
        console.log(`[${appName}] DEBUG | Message sent successfully:`, response.data);
    })
    .catch(error => {
        console.error(`[${appName}] DEBUG | Error sending message:`, error);
    });

    // response
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            'project-name': projectName,
            'build-id': buildId,
            'build-status': buildStatus
        })
    };
    return response;
};
