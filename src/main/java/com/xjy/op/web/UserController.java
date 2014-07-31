package com.xjy.op.web;

import com.xjy.op.dto.UserDto;
import com.xjy.op.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller
public class UserController {

    @Autowired
    public UserService userService;

    @RequestMapping("/user/search/name")
    @ResponseBody
    public List<UserDto> searchFriendsByName(final String name){
        return userService.searchFriendsByName(name);
    }

    @RequestMapping("/user/add/{id}/{spaceId}")
    @ResponseBody
    public Map<String , Object> addFriend(@PathVariable int id, @PathVariable int spaceId){
        return userService.addFriend(id, spaceId);
    }

    @RequestMapping("/user/delete/{id}/{spaceId}")
    @ResponseBody
    public Map<String , Object> deleteFriend(@PathVariable int id, @PathVariable int spaceId){
        return userService.deleteFriend(id, spaceId);
    }
}