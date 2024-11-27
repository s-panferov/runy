#![feature(custom_test_frameworks)]
#![test_runner(datatest::runner)]

use std::path::Path;

use tests::update_snapshot;

fn schema(path: &Path) -> datatest_stable::Result<()> {
	let value = tests::schema(path);

	let mut path = path.to_path_buf();
	path.set_extension("yml");

	let result = serde_yaml::to_string(&value).unwrap();
	update_snapshot(result, path);

	Ok(())
}

datatest_stable::harness!(schema, "schema", r"^.*/*.ts",);
