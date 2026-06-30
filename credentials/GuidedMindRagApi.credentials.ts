import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GuidedMindRagApi implements ICredentialType {
	name = 'guidedMindRagApi';

	displayName = 'GuidedMind RAG API';

	documentationUrl = 'https://guidedmind.ai/docs/integration/api-overview';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your GuidedMind RAG project key (starts with rk_). Found in the project dashboard.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.guidedmind.ai',
			description: 'Override only for self-hosted or staging GuidedMind instances.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{ $credentials.apiKey }}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{ $credentials.baseUrl }}',
			url: '/api/v1/mcp/health',
		},
	};
}
