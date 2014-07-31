package com.xjy.op.dao;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration("file:src/main/webapp/WEB-INF/mvc-dispatcher-servlet.xml")
public class DocumentDaoTest {

    @Autowired
    public DocumentDao documentDao;

    @Test
    public void testCreateDocument() {
        int id = documentDao.createDocument("测试文档",1);
        Assert.assertNotSame(-1, id);
    }
}
