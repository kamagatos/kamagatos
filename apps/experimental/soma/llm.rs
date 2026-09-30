//! LLM calls the soma task makes, over the shared Rust http library.
use eldon_error::EldonError;
use serde::{Deserialize, Serialize};

/// Gemini embedding model the task embeds with.
const EMBEDDING_MODEL: &str = "gemini-embedding-2";

#[derive(Serialize, Deserialize)]
struct EmbedContentRequest {
    model: String,
    content: EmbedContentInput,
}

#[derive(Serialize, Deserialize)]
struct EmbedContentInput {
    parts: Vec<EmbedContentPart>,
}

#[derive(Serialize, Deserialize)]
struct EmbedContentPart {
    text: String,
}

#[derive(Serialize, Deserialize)]
struct EmbedContentResponse {
    embedding: EmbedContentEmbedding,
}

#[derive(Serialize, Deserialize)]
struct EmbedContentEmbedding {
    values: Vec<f64>,
}

/// Embed `text` with Gemini Embedding 2 and return the embedding vector.
pub async fn embed(text: &str, api_key: &str) -> Result<Vec<f64>, EldonError> {
    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/{EMBEDDING_MODEL}:embedContent?key={api_key}"
    );
    let request = EmbedContentRequest {
        model: format!("models/{EMBEDDING_MODEL}"),
        content: EmbedContentInput {
            parts: vec![EmbedContentPart {
                text: text.to_string(),
            }],
        },
    };
    let response: EmbedContentResponse = http::post(url, request).await?;

    Ok(response.embedding.values)
}
