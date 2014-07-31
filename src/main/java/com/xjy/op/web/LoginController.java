package com.xjy.op.web;

import com.xjy.op.dto.FileDto;
import com.xjy.op.dto.SpaceDto;
import com.xjy.op.dto.UserDto;
import com.xjy.op.service.FileService;
import com.xjy.op.service.SpaceService;
import com.xjy.op.service.UserService;
import com.xjy.op.web.command.UserCommand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.SessionAttributes;

import javax.servlet.http.HttpSession;
import java.util.List;

@Controller
@SessionAttributes("user")
public class LoginController {

    @Autowired
    private UserService userService;
    @Autowired
    private SpaceService spaceService;
    @Autowired
    private FileService fileService;

    @RequestMapping(value = "/")
    public String loginHome() {
        return "login";
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public String login(@ModelAttribute UserCommand user, ModelMap model) {
        UserDto userDto = userService.login(user);
        SpaceDto spaceDto = spaceService.getLoginSpace(userDto.getId());
        List<UserDto> friendList = userService.getFriends(userDto.getId(),spaceDto.getId());
        List<SpaceDto> spaceDtoList = spaceService.getSpaceListByUserId(userDto.getId());
        if (userDto != null) {
            model.addAttribute("user", userDto);
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