use tests::client::test_workspace;

#[test]
fn simple_build() -> anyhow::Result<()> {
	let (mut client, root) = test_workspace()?;

	client.daemon(false);

	std::fs::create_dir_all(root.path().join("src"))?;

	std::fs::write(
		root.path().join("tsconfig.json"),
		r#"
			{
				"compilerOptions": {
					"target": "ESNext",
					"module": "commonjs",
					"declaration": true,
					"outDir": "dist",
					"strict": true,
					"esModuleInterop": true
				},
				"include": ["src/**/*.ts"],
				"exclude": [
					"node_modules",
					"dist"
				]
			}
		"#,
	)?;

	std::fs::write(
		root.path().join("package.json"),
		r#"
			{ "name": "test", "dependencies": { "typescript": "*" }}
		"#,
	)?;

	std::fs::write(
		root.path().join("src/index.ts"),
		r#"
			console.log("TEST")
		"#,
	)?;

	std::fs::write(
		root.path().join("runy.ts"),
		r#"
			import "runy";
			import { genrule } from "runy/core/genrule.ts"

			const npm = genrule({
				name: "npm",
				context: import.meta,
				command: "pnpm",
				args: ["install"],
				sources: [
					"package.json"
				]
			})

			genrule({
				name: "test",
				context: import.meta,
				command: "pnpm",
				args: ["exec", "tsc", "-b"],
				sources: ["src/**/*.ts"],
				deps: [npm]
			})
		"#,
	)?;

	std::fs::create_dir_all(root.path().join("src"))?;

	let index_path = root.path().join("src").join("index.ts");
	std::fs::write(&index_path, "")?;

	// let result = client.query(r#"target(name: "test") { plan }"#)?;
	// println!("{result:#?}");

	let result = client.build("test");
	println!("TEST result");

	println!("{}", serde_json::to_string_pretty(&result).unwrap());

	// std::println!("{:?}", res);

	// let res = client.build("test");
	// // std::println!("{:?}", res);

	// let res = client.build("test");
	// // std::println!("{:?}", res);

	Ok(())
}
