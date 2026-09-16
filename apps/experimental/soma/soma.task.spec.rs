// Integration test compiled by `cargo test --test tests`. The handler lives in
// a binary crate the test cannot link against, so assert on the character-by-
// character read the handler performs over a file's contents.
use std::fs;

#[test]
fn reads_a_file_character_by_character() {
    let path = std::env::temp_dir().join("soma_spec_input.txt");
    fs::write(&path, "aé\n").expect("write temp file");

    let contents = fs::read_to_string(&path).expect("read temp file");
    let characters: Vec<char> = contents.chars().collect();

    assert_eq!(characters, vec!['a', 'é', '\n']);
    assert_eq!(characters.len(), 3);
}
