const axios = require('axios');

exports.handler = async (event) => {
    const codebuild_project_name = event.detail['project-name'];
    const build_number = event.detail['build-number'];
    const build_id = event.detail['build-id'];
    console.log(`[handler] DEBUG | [${codebuild_project_name}:${build_number}] build_id: ${build_id}`);
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
