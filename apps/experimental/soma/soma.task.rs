use h_task::{run, TaskParams};
use serde_json::{json, Value};
use std::fs;

fn handler(params: TaskParams) -> Result<Value, String> {
    let path = params
        .task_options
        .get("file")
        .and_then(Value::as_str)
        .ok_or_else(|| "task option `file` is required".to_string())?;

    let contents =
        fs::read_to_string(path).map_err(|error| format!("failed to read {path}: {error}"))?;

    let mut count = 0;
    for character in contents.chars() {
        println!("{character:?}");
        count += 1;
    }

    Ok(json!({
        "file": path,
        "characters": count,
    }))
}

fn main() {
    run(handler);
}
