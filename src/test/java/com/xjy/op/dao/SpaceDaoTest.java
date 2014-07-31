package com.xjy.op.dao;

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
public class SpaceDaoTest {

    @Autowired
    private SpaceDao spaceDao;

    @Test
    public void testAddSpace() throws Exception {

    }

    @Test
    public void testEditSpace() throws Exception {

    }

    @Test
    public void testGetSpaceById() throws Exception {

    }

    @Test
    public void testDeleteSpace() throws Exception {

    }

    @Test
    public void testGetSpacesByUserId() throws Exception {
        System.out.println(spaceDao.getSpacesByUserId(6).size());
        Assert.assertEquals("数目不同", 1, spaceDao.getSpacesByUserId(6).size());
    }
}
