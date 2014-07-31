package com.xjy.op.service;

import com.xjy.op.dao.FileDao;
import com.xjy.op.dao.UserDao;
import com.xjy.op.dto.FileDto;
import com.xjy.op.dto.UserDto;
import com.xjy.op.web.command.UserCommand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileService {

    @Autowired
    private FileDao fileDao;

    public List<FileDto> getSpaceFiles(int spaceId){
        return fileDao.getSpaceFiles(spaceId);
    }

    public FileDto getFileById(int id){
        return fileDao.getFileById(id);
    }

}
