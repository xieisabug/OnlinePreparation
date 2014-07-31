package com.xjy.op.web;

import com.xjy.op.dto.FileDto;
import com.xjy.op.dto.SpaceDto;
import com.xjy.op.dto.UserDto;
import com.xjy.op.service.FileService;
import com.xjy.op.service.SpaceService;
import com.xjy.op.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
public class SpaceController {

    @Autowired
    public SpaceService spaceService;
    @Autowired
    public UserService userService;
    @Autowired
    public FileService fileService;

    @RequestMapping("/space/{spaceId}/{userId}")
    public String jumpSpace(@PathVariable int spaceId, ModelMap model, @PathVariable int userId) {
        UserDto userDto = userService.getUserById(userId);
        model.addAttribute("user",userDto);
        SpaceDto spaceDto = spaceService.getSpaceById(spaceId);
        List<UserDto> friendList = userService.getFriends(userDto.getId(),spaceId);
        List<SpaceDto> spaceDtoList = spaceService.getSpaceListByUserId(userDto.getId());
        if (userDto != null) {
            model.addAttribute("friendList", friendList);
            if (spaceDto == null) {
                return "createSpace";
            }
            model.addAttribute("spaceList", spaceDtoList);
            model.addAttribute("space", spaceDto);
            List<FileDto> fileDtoList = fileService.getSpaceFiles(spaceDto.getId());
            model.addAttribute("fileList", fileDtoList);
            return "home";
        } else {
            model.addAttribute("message", "您输入的信息有误，请重新输入");
            return "login";
        }
    }
}