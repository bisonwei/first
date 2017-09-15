package com.wei.first.web;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.wei.first.service.LoginService;

@Controller
@RequestMapping(value="/app")
public class LoginController {
	
	@Autowired
    private LoginService loginService;
	
	 @ResponseBody
	 @RequestMapping(value = "treeData")
	 public JSONObject login(@RequestParam(required=false) JSONObject req, HttpServletResponse response) {
		
		 return req;
		 
	 }
}
