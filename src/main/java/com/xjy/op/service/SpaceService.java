package com.xjy.op.service;

import com.xjy.op.dao.SpaceDao;
import com.xjy.op.dao.UserDao;
import com.xjy.op.dto.SpaceDto;
import com.xjy.op.dto.UserDto;
import com.xjy.op.web.command.UserCommand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpaceService {

    @Autowired
    private SpaceDao spaceDao;

    public SpaceDto getLoginSpace(int userId){
        List<SpaceDto> spaceDtoList = spaceDao.getSpacesByUserId(userId);
        if(spaceDtoList.size() == 0) {
            return null;
        } else {
            return spaceDtoList.get(0);
        }
    }

    public List<SpaceDto> getSpaceListByUserId(int userId){
        return spaceDao.getSpacesByUserId(userId);
    }

    public SpaceDto getSpaceById(int id) {
        return spaceDao.getSpaceById(id);
    }

}
