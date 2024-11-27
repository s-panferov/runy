use std::ops::{ControlFlow, FromResidual, Try};
use std::path::PathBuf;
use std::process::{Command, Output, Stdio};

use anyhow::Context;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tempfile::TempDir;

use crate::manifest;

pub struct Runa {
	pub binary: String,
	pub root: PathBuf,
	pub daemon: bool,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct ClientResponse<T> {
	pub data: Option<T>,
	pub errors: Vec<serde_json::Value>,
}

impl<T> Default for ClientResponse<T> {
	fn default() -> Self {
		ClientResponse {
			data: None,
			errors: Vec::new(),
		}
	}
}

#[derive(thiserror::Error, Debug)]
pub enum ClientError {
	#[error("no data")]
	NoData,
	#[error("graphql: {0:?}")]
	Errors(Vec<serde_json::Value>),
}

impl<T> Try for ClientResponse<T> {
	type Output = T;
	type Residual = ClientError;

	fn from_output(output: Self::Output) -> Self {
		ClientResponse {
			data: Some(output),
			errors: Vec::new(),
		}
	}

	fn branch(self) -> ControlFlow<Self::Residual, Self::Output> {
		if !self.errors.is_empty() {
			return ControlFlow::Break(ClientError::Errors(self.errors));
		}

		if let Some(data) = self.data {
			return ControlFlow::Continue(data);
		} else {
			return ControlFlow::Break(ClientError::NoData);
		}
	}
}

impl<T> FromResidual<ClientError> for Result<T, anyhow::Error> {
	fn from_residual(residual: ClientError) -> Self {
		Err(residual.into())
	}
}

impl<T> FromResidual for ClientResponse<T> {
	fn from_residual(residual: ClientError) -> Self {
		match residual {
			ClientError::NoData => ClientResponse::default(),
			ClientError::Errors(e) => ClientResponse {
				data: None,
				errors: e,
			},
		}
	}
}

impl Runa {
	pub fn new() -> Runa {
		Runa {
			binary: "/Users/stanislav/.bin/runy".into(),
			root: PathBuf::new(),
			daemon: true,
		}
	}

	pub fn root(&mut self, path: PathBuf) {
		self.root = path;
	}

	pub fn daemon(&mut self, enable: bool) {
		self.daemon = enable;
	}

	pub fn query(&self, query: &str) -> ClientResponse<Value> {
		let mut command = Command::new(&self.binary);

		if !self.daemon {
			command.arg(if self.daemon { "" } else { "--no-daemon" });
		}

		command
			.arg("query")
			.arg(query)
			.stderr(Stdio::inherit())
			.current_dir(&self.root);

		println!("{}", debug_command(&command));

		output_to_result(command.output().expect("Failed to run the application."))
	}

	pub fn build(&self, target: &str) -> ClientResponse<Value> {
		let mut command = Command::new(&self.binary);

		if !self.daemon {
			command.arg(if self.daemon { "" } else { "--no-daemon" });
		}

		command
			.arg("build")
			.arg(target)
			.stderr(Stdio::inherit())
			.current_dir(&self.root);

		println!("{}", debug_command(&command));
		output_to_result(command.output().expect("Failed to run the application."))
	}
}

fn output_to_result(output: Output) -> ClientResponse<Value> {
	let stdout = std::str::from_utf8(&output.stdout)
		.expect("Failed to convert stdout to String.")
		.trim()
		.to_string();

	serde_yaml::from_str(&stdout).context(stdout).unwrap()
}

pub fn test_workspace() -> anyhow::Result<(Runa, TempDir)> {
	let mut client = Runa::new();
	let folder = tempfile::Builder::new().prefix("runy").tempdir()?;
	let path = folder.path().to_owned();
	client.root(path.clone());
	let manifest = manifest();
	std::fs::write(path.join("runy.json"), manifest)?;
	Ok((client, folder))
}

pub fn debug_command(cmd: &Command) -> String {
	let cmd_str = format!(
		"{} {}",
		cmd.get_program().to_string_lossy(),
		cmd.get_args()
			.map(|arg| arg.to_string_lossy().into_owned())
			.collect::<Vec<String>>()
			.join(" ")
	);
	cmd_str
}
