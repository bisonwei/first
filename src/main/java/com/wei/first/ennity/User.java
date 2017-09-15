package com.wei.first.ennity;

public class User {
	private Integer id;
	
	public User(Integer id, String login_name, String name, String password, String mobile, String email,
			String state) {
		super();
		this.id = id;
		this.login_name = login_name;
		this.name = name;
		this.password = password;
		this.mobile = mobile;
		this.email = email;
		this.state = state;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", login_name=" + login_name + ", name=" + name + ", password=" + password
				+ ", mobile=" + mobile + ", email=" + email + ", state=" + state + "]";
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getLogin_name() {
		return login_name;
	}

	public void setLogin_name(String login_name) {
		this.login_name = login_name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	private String login_name;
	
	private String name;
	
	private String password;
	
	private String mobile;
	
	private String email;
	
	private String state;
}
