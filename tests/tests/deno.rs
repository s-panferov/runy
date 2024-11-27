use tests::client::test_workspace;

#[test]
fn no_json_rpc() -> Result<(), anyhow::Error> {
	let (mut client, root) = test_workspace()?;
	client.daemon(false);

	std::fs::write(root.path().join("runy.ts"), r#""#)?;
	let res = client.query("targets { target { name } }");

	println!("{:?}", res);

	Ok(())
}
