package com.wei.first.dao;

import org.apache.ibatis.annotations.Param;

import com.wei.first.ennity.User;

public interface UserDao {
	
	User findUserById(@Param("id") Integer id);

}
