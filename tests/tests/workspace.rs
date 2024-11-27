#![feature(custom_test_frameworks)]
#![test_runner(datatest::runner)]

use std::io::Write;
use std::path::Path;
use std::process::{Command, Stdio};

use anyhow::bail;
use tests::update_snapshot;

fn test_spec(path: &Path) -> datatest_stable::Result<()> {
	let query = r#"
		targets { target { name }, context, deps { target { name } } }
	"#;

	let root = path.parent().unwrap();
	let result = runy_query(query, root)?;
	let result = serde_yaml::to_string(&result)?;

	let mut path = path.to_path_buf();
	path.set_extension("yml");

	update_snapshot(result, path);

	Ok(())
}

fn runy_query(query: &str, root: &Path) -> anyhow::Result<serde_json::Value> {
	let output = Command::new("runy")
		.args(["--no-daemon", "query", query])
		.stderr(Stdio::inherit())
		.stdout(Stdio::piped())
		.current_dir(root)
		.spawn()
		.unwrap()
		.wait_with_output()?;

	if !output.status.success() {
		bail!("Failed with error")
	}

	std::io::stdout().write(&output.stdout)?;

	let result: serde_json::Value = serde_yaml::from_slice(&output.stdout)?;
	Ok(result)
}

datatest_stable::harness!(test_spec, "workspace", r"^.**/*/runy.json",);
