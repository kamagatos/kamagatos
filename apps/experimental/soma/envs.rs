//! Env values the soma task reads, resolved from the process environment the
//! `h` runner injects secrets into.
use std::env;

/// Envs the soma task uses.
#[derive(Debug)]
pub struct Envs {
    pub gemini_api_key: String,
}

/// Read soma's envs for the given environment name, e.g. `development`.
pub fn get_envs(env_name: &str) -> Result<Envs, String> {
    Ok(Envs {
        gemini_api_key: read_global(env_name, "GEMINI_API_KEY")?,
    })
}

/// Read the `<ENV>_GLOBAL_<NAME>` variable for the given environment.
fn read_global(env_name: &str, name: &str) -> Result<String, String> {
    let key = format!("{}_GLOBAL_{}", env_name.to_uppercase(), name);

    env::var(&key).map_err(|_| format!("{key} is not set"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_envs_reads_the_global_gemini_api_key() {
        env::set_var("SOMA_SPEC_GLOBAL_GEMINI_API_KEY", "spec-key");

        let envs = get_envs("soma_spec").expect("envs should resolve");

        assert_eq!(envs.gemini_api_key, "spec-key");
    }

    #[test]
    fn get_envs_errors_when_the_key_is_not_set() {
        let error = get_envs("soma_spec_missing").expect_err("envs should error");

        assert_eq!(error, "SOMA_SPEC_MISSING_GLOBAL_GEMINI_API_KEY is not set");
    }
}
