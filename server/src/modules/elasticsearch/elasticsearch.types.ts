export interface ElasticsearchReply {
  id: string;
  author: string;
  content: string;
}

export interface ElasticsearchQuestion extends ElasticsearchReply {
  replies: ElasticsearchReply[];
}
