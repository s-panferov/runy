use serde_json::Value;
use tests::client::test_workspace;
use tests::json::v;

#[test]
fn simple() -> Result<(), anyhow::Error> {
	let (client, root) = test_workspace()?;

	std::fs::write(
		root.path().join("runy.ts"),
		r#"
			import "runy";
			import { genrule } from "runy/core/genrule.ts"

			genrule({
				name: "test",
				context: import.meta,
				command: "test",
				sources: ["src/**/*.ts"],
				deps: []
			})
		"#,
	)?;

	std::fs::create_dir_all(root.path().join("src"))?;

	let index_path = root.path().join("src").join("index.ts");
	std::fs::write(&index_path, "")?;

	let res = client.query("targets { target { name } }")?;
	println!("{res:?}");
	assert_eq!(v(&res, "$.targets[0].target.name")?.as_str(), Some("test"));

	let res = client.query(r#"target(name: "test") { plan }"#)?;
	let (file, modified_at) = index_file(&res)?;

	println!("Source file => {file}: {modified_at}");

	let res = client.query(r#"target(name: "test") { plan }"#)?;
	let new = index_file(&res)?;

	assert_eq!(modified_at, new.1, "Expected to have the same metadata");

	// Writing to update the file
	std::fs::write(&index_path, "import 'a'")?;

	// Query again!
	let res = client.query(r#"target(name: "test") { plan }"#)?;
	let new = index_file(&res)?;

	assert_ne!(modified_at, new.1, "Expected to have a different metadata");

	// UPDATING THE WORKSPACE FILE
	std::fs::write(
		root.path().join("runy.ts"),
		r#"
			import "runy";
			import { genrule } from "runy/core/genrule.ts"

			genrule({
				name: "a",
				context: import.meta,
				command: "test",
				sources: ["src/**/*.ts"],
				deps: []
			})

			genrule({
				name: "b",
				context: import.meta,
				command: "test",
				sources: ["src/**/*.ts"],
				deps: []
			})
		"#,
	)?;

	// THIS SHOULD RECONCILE WORKSPACE
	let res = client.query("targets { target { name } }")?;
	assert_eq!(v(&res, "$.targets[0].target.name")?.as_str(), Some("a"));
	assert_eq!(v(&res, "$.targets[1].target.name")?.as_str(), Some("b"));

	Ok(())
}

fn index_file(res: &Value) -> Result<(&String, &serde_json::Number), anyhow::Error> {
	let res = v(&res, "$.target.plan.sources")?.as_object().unwrap();
	let (file, meta) = res
		.iter()
		.find(|(k, _)| k.contains("index.ts"))
		.expect("Present");
	let modified_at = v(&meta, "$.modified_at")?.as_number().unwrap();
	Ok((file, modified_at))
}
