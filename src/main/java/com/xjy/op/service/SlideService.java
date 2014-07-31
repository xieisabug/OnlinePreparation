package com.xjy.op.service;

import com.xjy.op.dao.SlideDao;
import com.xjy.op.dto.SlideDto;
import com.xjy.op.dto.SlidePartDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SlideService {

    @Autowired
    private SlideDao slideDao;

    public SlideDto getSlideByFileId(int fileId) {
        return slideDao.getSlideByFileId(fileId);
    }

    public int createSlide(String name, int spaceId) {
        return slideDao.createSlide(name, spaceId);
    }

    public void saveSlidePart(SlidePartDto slidePartDto) {
        slideDao.saveSlidePart(slidePartDto);
    }

    public int createSlidePart(int slideId) {
        return slideDao.insertSlidePart(slideId,"");
    }
}
