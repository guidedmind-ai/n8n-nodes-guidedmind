import type {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GuidedMindMemoryApi implements ICredentialType {
	name = 'guidedMindMemoryApi';

	displayName = 'GuidedMind Memory API';

	documentationUrl = 'https://guidedmind.ai/docs/short-memory/step2-api-setup';

	properties: INodeProperties[] = [
		{
			displayName: 'Memory API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your GuidedMind Memory key (starts with mk_). This is separate from the RAG key.',
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
				'X-Memory-Api-Key': '={{ $credentials.apiKey }}',
			},
		},
	};
}
