const axios = require('axios');

exports.handler = async (event) => {
    // const
    const appName = 'CodebuildNotification';
    const account = event.account;
    const region = event.region;
    const buildDetails = event.detail;
    const projectName = buildDetails['project-name'];
    const buildStatus = buildDetails['build-status'];
    const version = buildDetails['version'];
    const buildId = buildDetails['build-id'];
    const codebuildPageUrl = `https://${region}.console.aws.amazon.com/codesuite/codebuild/${account}/projects/${projectName}/build/${buildId}/log`;
    const currentPhaseContext = buildDetails['current-phase-context'];
    const webhookUrl = process.env.WEBHOOK_URL;
    const messages = {
        'IN_PROGRESS': process.env.IN_PROGRESS_MESSAGE ?? 'The build has started.',
        'SUCCESS':  process.env.SUCCESS_MESSAGE ?? 'The build completed successfully.',
        'FAILED': process.env.FALIED_MESSAGE ?? 'The build failed.'
    };

    // common message
    console.log(`[${appName}] DEBUG | project-name: ${projectName}:${version}`);
    console.log(`[${appName}] DEBUG | build-id: ${buildId}}`);
    console.log(`[${appName}] DEBUG | build-status: ${buildStatus}`);
    console.log(`[${appName}] DEBUG | codebuild-url: ${codebuildPageUrl}`);
    console.log(`[${appName}] DEBUG | current-phase-context: ${currentPhaseContext}`);
    console.log(`[${appName}] DEBUG | env: ${process.env.SAMPLE}`);

    // notification
    const message = {
        text: `${projectName}:${version}\n${messages[buildStatus]}\n\n${codebuildPageUrl}`
    };
    const headers = {'Content-Type': 'application/json'};
    axios.post(webhookUrl, message, {headers})
    .then(response => {
        console.log('[${appName}] DEBUG | Message sent successfully:', response.data);
    })
    .catch(error => {
        console.error('[${appName}] DEBUG | Error sending message:', error);
    });

    // response
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            'project-name': `${projectName}:${version}`,
            'build-id': buildId,
            'build-status': buildStatus
        })
    };
    return response;
};
