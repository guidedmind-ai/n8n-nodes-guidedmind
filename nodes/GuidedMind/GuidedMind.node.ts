import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

export class GuidedMind implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GuidedMind',
		name: 'guidedMind',
		icon: 'file:guidedmind.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Retrieve from your GuidedMind knowledge base and read/write agent memory',
		defaults: {
			name: 'GuidedMind',
		},
		// Allows the node to be used as a tool by the AI Agent node.
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'guidedMindRagApi',
				required: true,
				displayOptions: {
					show: { authentication: ['guidedMindRagApi'] },
				},
			},
			{
				name: 'guidedMindMemoryApi',
				required: true,
				displayOptions: {
					show: { authentication: ['guidedMindMemoryApi'] },
				},
			},
		],
		properties: [
			// ----------------------------------------
			//          Authentication (hidden)
			// ----------------------------------------
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'hidden',
				default: '={{ $parameter["resource"] === "memory" ? "guidedMindMemoryApi" : "guidedMindRagApi" }}',
			},
			// ----------------------------------------
			//             Resource
			// ----------------------------------------
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Knowledge Base (RAG)',
						value: 'rag',
						description: 'Search documents indexed in your GuidedMind project',
					},
					{
						name: 'Document',
						value: 'document',
						description: 'Upload and process documents',
					},
					{
						name: 'Memory',
						value: 'memory',
						description: 'Store and recall short- and long-term agent memory',
					},
				],
				default: 'rag',
			},

			// ========================================
			//                RAG
			// ========================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['rag'] } },
				options: [
					{
						name: 'Search',
						value: 'search',
						action: 'Search the knowledge base',
						description: 'Return the most relevant chunks for a query',
						routing: {
							request: {
								method: 'POST',
								baseURL: '={{ $credentials.baseUrl }}',
								url: '/rag/search',
							},
						},
					},
				],
				default: 'search',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				description: 'The search query (1-1000 characters)',
				displayOptions: { show: { resource: ['rag'], operation: ['search'] } },
				routing: {
					send: { type: 'body', property: 'query' },
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 20 },
				default: 5,
				description: 'Max number of chunks to return',
				displayOptions: { show: { resource: ['rag'], operation: ['search'] } },
				routing: {
					send: { type: 'body', property: 'k' },
				},
			},
			{
				displayName: 'Threshold',
				name: 'threshold',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 2 },
				default: 0.7,
				description: 'Minimum similarity score (0-1). Lower returns more, less precise results.',
				displayOptions: { show: { resource: ['rag'], operation: ['search'] } },
				routing: {
					send: { type: 'body', property: 'threshold' },
				},
			},
			{
				displayName: 'Include Metadata',
				name: 'includeMetadata',
				type: 'boolean',
				default: true,
				displayOptions: { show: { resource: ['rag'], operation: ['search'] } },
				routing: {
					send: { type: 'body', property: 'options.includeMetadata' },
				},
			},

			// ========================================
			//              DOCUMENT
			// ========================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['document'] } },
				options: [
					{
						name: 'Upload',
						value: 'upload',
						action: 'Upload a document',
						description: 'Upload a document without immediate processing',
						routing: {
							request: {
								method: 'POST',
								baseURL: '={{ $credentials.baseUrl }}',
								url: '/api/v1/documents/upload',
							},
						},
					},
					{
						name: 'Upload and Process',
						value: 'uploadAndProcess',
						action: 'Upload and process a document',
						description: 'Upload a document and start indexing immediately',
						routing: {
							request: {
								method: 'POST',
								baseURL: '={{ $credentials.baseUrl }}',
								url: '/api/v1/documents/upload-and-process',
							},
						},
					},
				],
				default: 'uploadAndProcess',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				required: true,
				default: '',
				description: 'Target project ID from your GuidedMind dashboard',
				displayOptions: { show: { resource: ['document'] } },
				routing: { send: { type: 'body', property: 'project_id' } },
			},
			{
				displayName: 'File Path',
				name: 'filePath',
				type: 'string',
				required: true,
				default: '',
				description: 'Path or URL to the document to upload',
				displayOptions: { show: { resource: ['document'] } },
				routing: { send: { type: 'body', property: 'file_path' } },
			},
			{
				displayName: 'Chunk Size',
				name: 'chunkSize',
				type: 'number',
				default: 512,
				description: 'Override chunk size (defaults to the project setting)',
				displayOptions: { show: { resource: ['document'], operation: ['uploadAndProcess'] } },
				routing: { send: { type: 'body', property: 'chunk_size' } },
			},
			{
				displayName: 'Chunk Overlap',
				name: 'chunkOverlap',
				type: 'number',
				default: 50,
				description: 'Override chunk overlap (defaults to the project setting)',
				displayOptions: { show: { resource: ['document'], operation: ['uploadAndProcess'] } },
				routing: { send: { type: 'body', property: 'chunk_overlap' } },
			},

			// ========================================
			//               MEMORY
			// ========================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['memory'] } },
				options: [
					{
						name: 'Add Short Messages',
						value: 'shortAdd',
						action: 'Add messages to short memory',
						description: 'Append messages to a session transcript',
						routing: {
							request: { method: 'POST', url: '={{ $credentials.baseUrl }}/api/v1/memory/short/messages' },
						},
					},
					{
						name: 'Get Short Messages',
						value: 'shortGet',
						action: 'Get short memory for a session',
						description: 'Retrieve the active transcript for a session',
						routing: {
							request: {
								method: 'GET',
								url: '={{ $credentials.baseUrl }}/api/v1/memory/short/messages/{{ $parameter.sessionId }}',
							},
						},
					},
					{
						name: 'Store Long Memory',
						value: 'longStore',
						action: 'Store a long-term memory',
						description: 'Persist a durable fact about a user',
						routing: {
							request: { method: 'POST', url: '={{ $credentials.baseUrl }}/api/v1/memory/long/store' },
						},
					},
					{
						name: 'Search Long Memory',
						value: 'longSearch',
						action: 'Search long-term memory',
						description: 'Semantic search across a user’s stored memories',
						routing: {
							request: { method: 'POST', url: '={{ $credentials.baseUrl }}/api/v1/memory/long/search' },
						},
					},
				],
				default: 'longSearch',
			},
			// --- session id (short add/get, long store) ---
			{
				displayName: 'Session ID',
				name: 'sessionId',
				type: 'string',
				required: true,
				default: '',
				description: 'The conversation/session identifier',
				displayOptions: {
					show: { resource: ['memory'], operation: ['shortAdd', 'shortGet', 'longStore'] },
				},
				routing: {
					send: { type: 'body', property: 'session_id' },
				},
			},
			// --- short add: messages ---
			{
				displayName: 'Messages',
				name: 'messages',
				type: 'json',
				default:
					'=[\n  { "role": "user", "content": "{{ $json.chatInput }}" }\n]',
				description: 'Array of { role, content, metadata? } message objects',
				displayOptions: { show: { resource: ['memory'], operation: ['shortAdd'] } },
				routing: {
					send: { type: 'body', property: 'messages', value: '={{ JSON.parse($value) }}' },
				},
			},
			// --- long store fields ---
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				default: '',
				description: 'The external user identifier this memory belongs to',
				displayOptions: { show: { resource: ['memory'], operation: ['longStore'] } },
				routing: { send: { type: 'body', property: 'user_id' } },
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				options: [
					{ name: 'User', value: 'user' },
					{ name: 'Assistant', value: 'assistant' },
					{ name: 'System', value: 'system' },
				],
				default: 'user',
				displayOptions: { show: { resource: ['memory'], operation: ['longStore'] } },
				routing: { send: { type: 'body', property: 'role' } },
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				required: true,
				default: '',
				description: 'The fact or preference to remember',
				displayOptions: { show: { resource: ['memory'], operation: ['longStore'] } },
				routing: { send: { type: 'body', property: 'content' } },
			},
			// --- long search fields ---
			{
				displayName: 'Query',
				name: 'memoryQuery',
				type: 'string',
				required: true,
				default: '',
				description: 'What to recall from memory',
				displayOptions: { show: { resource: ['memory'], operation: ['longSearch'] } },
				routing: { send: { type: 'body', property: 'query' } },
			},
			{
				displayName: 'External User ID',
				name: 'externalUserId',
				type: 'string',
				required: true,
				default: '',
				description: 'Filter results to a specific user',
				displayOptions: { show: { resource: ['memory'], operation: ['longSearch'] } },
				routing: { send: { type: 'body', property: 'external_user_id' } },
			},
			{
				displayName: 'Limit',
				name: 'memoryLimit',
				type: 'number',
				default: 10,
				displayOptions: { show: { resource: ['memory'], operation: ['longSearch'] } },
				routing: { send: { type: 'body', property: 'limit' } },
			},
			{
				displayName: 'Threshold',
				name: 'memoryThreshold',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 2 },
				default: 0.7,
				displayOptions: { show: { resource: ['memory'], operation: ['longSearch'] } },
				routing: { send: { type: 'body', property: 'threshold' } },
			},
		],
	};
}
