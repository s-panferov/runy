#![feature(try_trait_v2)]

use std::io::ErrorKind;
use std::path::{Path, PathBuf};
use std::process::Command;

use base64::prelude::*;
use serde_json::{json, Value};

pub mod client;
pub mod json;

pub fn update_snapshot(mut output: String, mut path: PathBuf) {
	let hash = fxhash::hash32(&output);
	let hash = BASE64_STANDARD.encode(hash.to_le_bytes());

	output += &format!("\n// TEST_UPDATE={}", hash);

	if !path.exists() {
		std::fs::write(path, output).unwrap();
	} else {
		let current = std::fs::read_to_string(&path).unwrap();
		let (current_to_hash, _) = current.split_once("\n// TEST_UPDATE=").unwrap();

		let hash = fxhash::hash32(&current_to_hash);
		let hash = BASE64_STANDARD.encode(hash.to_le_bytes());

		if current != output {
			let test_update = std::env::var("TEST_UPDATE").ok();
			if test_update.as_deref() == Some(&hash) || test_update.as_deref() == Some("*") {
				std::fs::write(&path, &output).unwrap();
				path.set_extension("new.yaml");
				if path.exists() {
					std::fs::remove_file(path).unwrap();
				}
			} else {
				path.set_extension("new.yaml");
				std::fs::write(&path, &output).unwrap();
				similar_asserts::assert_eq!(current, output)
			}
		}
	}
}

pub fn deno(args: &[&str]) -> std::io::Result<Value> {
	// Run the command
	let output = Command::new("deno").args(args).output()?;

	let error = String::from_utf8(output.stderr.clone()).unwrap();
	if !error.is_empty() {
		eprintln!("[DENO ERROR] {}", error);
	}

	// Check if the command was successful
	if !output.status.success() {
		return Err(std::io::Error::new(
			ErrorKind::Other,
			"Command execution failed",
		));
	}

	// Convert the output to a string
	let output_str = std::str::from_utf8(&output.stdout)
		.map_err(|e| std::io::Error::new(ErrorKind::InvalidData, e))?;

	let output_str = output_str.trim();

	// Parse the JSON
	let json: Value = serde_json::from_str(output_str).map_err(|e| {
		eprintln!("{:?}", output_str.lines().nth(10));
		std::io::Error::new(ErrorKind::InvalidData, e)
	})?;

	Ok(json)
}

pub fn schema(path: &Path) -> Value {
	let path_str = path.to_str().unwrap();
	let value = deno(&[
		"run",
		"--allow-env",
		"--allow-read",
		"--import-map",
		"../runy.json",
		path_str,
	])
	.unwrap();
	value
}

pub fn manifest() -> String {
	let runy_deno = PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap())
		.parent()
		.unwrap()
		.join("packages/runy-deno");

	let runy_deno = runy_deno.to_string_lossy().to_owned();

	let manifest = serde_json::to_string_pretty(&json!({
		"imports": {
			"runy": format!("{runy_deno}/core/index.ts"),
			"runy/": format!("{runy_deno}/")
		}
	}))
	.unwrap();

	manifest
}
