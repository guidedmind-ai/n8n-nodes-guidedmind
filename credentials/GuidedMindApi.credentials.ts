import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GuidedMindApi implements ICredentialType {
	name = 'guidedMindApi';

	displayName = 'GuidedMind API';

	documentationUrl = 'https://guidedmind.ai/docs/integration/api-overview';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.guidedmind.ai',
			description: 'Override only for self-hosted or staging GuidedMind instances.',
		},
		{
			displayName: 'RAG API Key',
			name: 'ragApiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your GuidedMind RAG project key (starts with rk_). Used for Knowledge Base and Document operations.',
		},
		{
			displayName: 'Memory API Key',
			name: 'memoryApiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your GuidedMind Memory API key (starts with mk_). Used for Memory operations.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{ $parameter["resource"] === "memory" ? $credentials.memoryApiKey : $credentials.ragApiKey }}',
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
