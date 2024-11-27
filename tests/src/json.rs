use serde_json::Value;
use serde_json_path::JsonPath;

pub fn v<'a>(value: &'a Value, q: &str) -> Result<&'a Value, anyhow::Error> {
	Ok(path(q)?.query(&value).exactly_one()?)
}

pub fn path(p: &str) -> Result<JsonPath, anyhow::Error> {
	Ok(serde_json_path::JsonPath::parse(p)?)
}
