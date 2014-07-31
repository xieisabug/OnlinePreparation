package com.xjy.op.service;

import com.xjy.op.dao.SpaceDao;
import com.xjy.op.dao.UserDao;
import com.xjy.op.dto.UserDto;
import com.xjy.op.web.command.UserCommand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserDao userDao;
    @Autowired
    private SpaceDao spaceDao;

    public UserDto login(UserCommand user){
        if(user.getUsername().equals("") || user.getPassword().equals("")) {
            return null;
        }
        return userDao.login(user);
    }

    public List<UserDto> getFriends(int id, int spaceId){
        return userDao.getFriendsByUserId(id, spaceId);
    }

    public List<UserDto> searchFriendsByName(String name) {
        return userDao.searchUserByName(name);
    }

    public Map<String, Object> addFriend(int id, int spaceId) {
        Map<String, Object> ret = new HashMap<String, Object>();
        String message;
        boolean isSpaceUser = spaceDao.isSpaceUser(id, spaceId);
        if(isSpaceUser) {
            message = "用户已经添加到了空间中";
            ret.put("success", false);
        } else {
            boolean success = userDao.addFriend(id, spaceId);
            if(success) {
                message = "添加成功";
                ret.put("success", true);
            } else {
                message = "发生错误，请联系管理员";
                ret.put("success", false);
            }
        }
        ret.put("message", message);
        return ret;
    }

    public UserDto getUserById(int userId) {
        return userDao.getUserById(userId);
    }

    public Map<String, Object> deleteFriend(int id, int spaceId) {
        boolean success = userDao.deleteFriend(id,spaceId);
        Map<String, Object> ret = new HashMap<String, Object>();
        ret.put("success", success);
        return ret;
    }
}
