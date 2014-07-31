package com.xjy.op.dao;

import com.xjy.op.dto.SlideDto;
import junit.framework.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration("file:src/main/webapp/WEB-INF/mvc-dispatcher-servlet.xml")
public class SlideDaoTest {

    @Autowired
    public SlideDao slideDao;

    @Test
    public void testGetSlideByFileId() throws Exception {
        SlideDto slideDto = slideDao.getSlideByFileId(22);
        Assert.assertNotNull(slideDto);
        System.out.println(slideDto);
    }

    @Test
    public void testCreateSlide() throws Exception {
        int fileId = slideDao.createSlide("测试slide",1);
        System.out.println(fileId);
    }
}
