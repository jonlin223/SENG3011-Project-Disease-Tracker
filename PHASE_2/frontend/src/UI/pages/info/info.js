import React from 'react';

import { Box, Container, Grid, TextField } from '@mui/material';
import NavBar from '../navbar';
import InfoItem from './InfoComponents/infoItem';

const infoContent = [
    {
        disease: "Covid-19",
        info: `COVID-19 is a disease caused by a virus called SARS-CoV-2. Most people with COVID-19 have mild symptoms, 
        but some people become severely ill. Older adults and people who have certain underlying medical conditions are more likely to get severely ill. 
        Post-COVID conditions are a wide range of health problems people can experience four or more weeks after first getting COVID-19. 
        Even those who do not become severely ill from COVID-19 may experience post-COVID conditions.`,
        symptoms: `People with COVID-19 have had a wide range of symptoms reported – ranging from mild symptoms to severe illness. Symptoms may appear 2-14 days after exposure to the virus. 
        Anyone can have mild to severe symptoms. People with these symptoms may have COVID-19: Fever or chills, Cough, Shortness of breath or difficulty breathing,
        Fatigue, Muscle or body aches, Headache, New loss of taste or smell, Sore throat, Congestion or runny nose, Nausea or vomiting, Diarrhea`,
        prevention: `COVID-19 vaccines are effective at preventing you from getting sick. COVID-19 vaccines are highly effective at preventing severe illness, hospitalizations, and death. 
        Everyone ages 2 years and older should properly wear a well-fitting mask indoors in public in areas where the COVID-19 Community Level is high, regardless of vaccination status`
    },
    {
        disease: "Ebola",
        info: `Ebola virus disease (EVD) is a deadly disease with occasional outbreaks that occur mostly on the African continent. EVD most commonly affects people and nonhuman primates 
        (such as monkeys, gorillas, and chimpanzees). It is caused by an infection with a group of viruses within the genus Ebolavirus`,
        symptoms: `Symptoms may appear anywhere from 2 to 21 days after contact with the virus, with an average of 8 to 10 days. The course of the illness typically progresses from “dry” symptoms initially 
        (such as fever, aches and pains, and fatigue), and then progresses to “wet” symptoms (such as diarrhea and vomiting) as the person becomes sicker.`,
        prevention: `The U.S. Food and Drug Administration (FDA) approved the Ebola vaccine rVSV-ZEBOV (called Ervebo®) on December 19, 2019. This is the first FDA-approved vaccine for Ebola.`
    },
    {
        disease: "Hepatitis A",
        info: `Hepatitis means inflammation of the liver. When the liver is inflamed or damaged, its function can be affected. Heavy alcohol use, toxins, some medications, 
        and certain medical conditions can cause hepatitis, but it is often caused by a virus. In the United States, the most common hepatitis viruses are hepatitis A virus, 
        hepatitis B virus, and hepatitis C virus. Hepatitis A can be spread from close, personal contact with an infected person, such as through certain types of sexual contact (like oral-anal sex), 
        caring for someone who is ill, or using drugs with others. Hepatitis A is very contagious, and people can even spread the virus before they feel sick.`,
        symptoms: `If symptoms develop, they can include: Yellow skin or eyes, Not wanting to eat, Upset stomach, Throwing up, Stomach pain, Fever,  Dark urine or light- colored stools,
        Diarrhea, Joint pain, Feeling tired`, 
        prevention: `The best way to prevent hepatitis A is through vaccination with the hepatitis A vaccine. To get the full benefit of the hepatitis A vaccine, more than one shot is needed. 
        The number and timing of these shots depends on the type of vaccine you are given. Practicing good hand hygiene — including thoroughly washing hands after using the bathroom, changing diapers, 
        and before preparing or eating food — plays an important role in preventing the spread of hepatitis A.`
    },
    {
        disease: "Listeria",
        info: `Listeriosis is a serious infection usually caused by eating food contaminated with the bacterium Listeria monocytogenes. An estimated 1,600 people get listeriosis each year, and about 260 die. 
        The infection is most likely to sicken pregnant women and their newborns, adults aged 65 or older, and people with weakened immune systems.`,
        symptoms: `Listeriosis can cause a variety of symptoms, depending on the person and the part of the body affected. Listeria can cause fever and diarrhea similar to other foodborne germs, but this type of Listeria infection is rarely diagnosed. 
        Symptoms in people with invasive listeriosis, meaning the bacteria has spread beyond the gut, depend on whether the person is pregnant. Pregnant women typically experience only fever and other flu-like symptoms, such as fatigue and muscle aches. 
        However, infections during pregnancy can lead to miscarriage, stillbirth, premature delivery, or life-threatening infection of the newborn. For people other than pregnant women, symptoms can include headache, stiff neck, confusion, loss of balance, 
        and convulsions in addition to fever and muscle aches`,
        prevention: `Soft cheeses made with unpasteurized milk (also called raw milk) are estimated to be 50 to 160 times more likely to cause Listeria infection than when they are made with pasteurized milk. Although pasteurization of milk kills Listeria, 
        products made from pasteurized milk can still become contaminated if they are produced in facilities with unsanitary conditions.`
    },
    {
        disease: "Measles",
        info: `Measles is a highly contagious virus that lives in the nose and throat mucus of an infected person. 
        It can spread to others through coughing and sneezing. Measles is so contagious that if one person has it, 
        up to 90% of the people close to that person who are not immune will also become infected.`,
        symptoms: `Measles symptoms appear 7 to 14 days after contact with the virus and typically include high fever, cough, runny nose, and watery eyes. 
        Measles rash appears 3 to 5 days after the first symptoms.`,
        prevention: "Measles can be prevented with MMR vaccine. The vaccine protects against three diseases: measles, mumps, and rubella."
    }

]

export default function Info() {

    const [filteredContent, setFilteredContent] = React.useState(infoContent);

    const handleFilter = (event) => {
        console.log(event.target.value);
        let tmp = [];
        let i = 0;
        while (i < infoContent.length) {
            if (infoContent[i].disease.toUpperCase().startsWith(event.target.value.toUpperCase())) {
                tmp.push(infoContent[i]);
            }
            i = i + 1;
        }
        setFilteredContent(tmp);
    }

    return (
        <>
            <NavBar />
            <Container>
                <TextField label="Filter Diseases" variant="outlined" fullWidth onChange={handleFilter} sx={{mt: 4}} />
                <Box sx={{mt: 5}}>
                    <Grid container spacing ={2}>
                        {filteredContent.map((content) => {
                            return (
                                <Grid item xs={12}>
                                    <InfoItem
                                      disease={content.disease}
                                      info={content.info}
                                      symptoms={content.symptoms}
                                      prevention={content.prevention}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            </Container>
        </>
    )
}